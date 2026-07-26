"""
Traffic service — placeholder for future integration.

Free real-time traffic APIs are limited (most require a paid tier past a
small quota). Rather than skip the traffic dimension of the risk score
entirely, this returns a neutral, clearly-labeled placeholder value so the
risk_service can still weight it correctly - and so swapping in a real
provider later (e.g. TomTom's free tier, Google Routes API) only requires
changing this one function's internals, not its callers.
"""


def get_traffic_data(latitude: float, longitude: float) -> dict:
    return {
        "status": "unavailable",
        "congestion_level": None,   # future: "low" | "moderate" | "heavy"
        "note": "Live traffic integration not yet connected. Neutral score applied.",
    }