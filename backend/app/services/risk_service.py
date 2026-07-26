"""
Risk scoring service.

Combines weather, traffic, flood risk, and image evidence into a single
0-100 safety score plus a human-readable recommendation, per the weighting
defined in the original project spec:

    Weather:              40%
    Traffic:              30%
    Flood risk:           20%
    Image verification:   10%

Each sub-score is 0-100 where HIGHER = MORE DANGEROUS. The final weighted
score is inverted at the end so the stored risk_score follows the same
convention already used across the UI (StatCard/RiskBadge components):
HIGHER = MORE DANGEROUS, e.g. 92/100 = high risk, "WFH recommended."
"""

WEIGHTS = {
    "weather": 0.40,
    "traffic": 0.30,
    "flood": 0.20,
    "image": 0.10,
}


def _score_weather(weather_data: dict) -> float:
    """Returns 0-100 danger score from weather conditions. Higher = worse."""
    if not weather_data or weather_data.get("error"):
        return 20.0  # unknown weather -> mild default, not zero, not alarmist

    score = 0.0
    condition = (weather_data.get("condition") or "").lower()
    rainfall = weather_data.get("rainfall_mm_last_1h") or 0
    wind_speed = weather_data.get("wind_speed_ms") or 0
    visibility = weather_data.get("visibility_meters")

    # Condition severity
    condition_scores = {
        "thunderstorm": 40,
        "rain": 25,
        "drizzle": 10,
        "snow": 30,
        "mist": 15,
        "fog": 20,
        "clear": 0,
        "clouds": 5,
    }
    score += condition_scores.get(condition, 10)

    # Rainfall intensity (mm in the last hour)
    if rainfall >= 15:
        score += 35
    elif rainfall >= 7.5:
        score += 20
    elif rainfall >= 2.5:
        score += 10

    # Wind speed (m/s)
    if wind_speed >= 15:
        score += 15
    elif wind_speed >= 10:
        score += 8

    # Visibility (meters) - low visibility is dangerous for commuting
    if visibility is not None:
        if visibility < 1000:
            score += 15
        elif visibility < 4000:
            score += 7

    return min(score, 100.0)


def _score_traffic(traffic_data: dict) -> float:
    """
    Returns 0-100 danger score from traffic congestion.
    Currently always neutral since live traffic isn't connected (see traffic_service.py).
    """
    if not traffic_data or traffic_data.get("status") == "unavailable":
        return 30.0  # neutral midpoint - deliberately not 0, so it doesn't silently
                     # pull the overall score down just because data is missing

    congestion = traffic_data.get("congestion_level")
    congestion_scores = {"low": 10, "moderate": 45, "heavy": 85}
    return congestion_scores.get(congestion, 30.0)


def _score_flood(weather_data: dict) -> float:
    """
    Derives a flood-risk proxy from rainfall data until dedicated flood
    detection (Phase 9+ future AI feature) is built.
    """
    if not weather_data or weather_data.get("error"):
        return 15.0

    rainfall = weather_data.get("rainfall_mm_last_1h") or 0
    if rainfall >= 20:
        return 90.0
    if rainfall >= 10:
        return 60.0
    if rainfall >= 4:
        return 30.0
    return 5.0


def _score_image(image_url: str | None) -> float:
    """
    Placeholder for AI image verification (flood/road-damage detection,
    fake-image detection - listed as a "Future AI Feature" on the landing page).
    For now: presence of an image is treated as a mild risk-confirming signal
    since the employee took the extra step of providing visual evidence,
    without claiming to have actually analyzed the image content.
    """
    return 25.0 if image_url else 0.0


def calculate_risk_score(weather_data: dict, traffic_data: dict, image_url: str | None) -> dict:
    """
    Returns {"risk_score": int, "recommendation": str}.
    risk_score: 0-100, higher = more dangerous / more justified to WFH.
    """
    weather_score = _score_weather(weather_data)
    traffic_score = _score_traffic(traffic_data)
    flood_score = _score_flood(weather_data)
    image_score = _score_image(image_url)

    weighted_total = (
        weather_score * WEIGHTS["weather"]
        + traffic_score * WEIGHTS["traffic"]
        + flood_score * WEIGHTS["flood"]
        + image_score * WEIGHTS["image"]
    )

    risk_score = round(min(max(weighted_total, 0), 100))
    recommendation = _build_recommendation(risk_score)

    return {"risk_score": risk_score, "recommendation": recommendation}


def _build_recommendation(risk_score: int) -> str:
    if risk_score >= 70:
        return "High travel risk. WFH recommended."
    if risk_score >= 40:
        return "Moderate travel risk. WFH may be warranted - manager review advised."
    return "Low travel risk. Normal commute appears safe."