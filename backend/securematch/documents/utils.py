from typing import Any, Dict, Optional


def success_response(
    data: Optional[Dict[str, Any]] = None,
    meta: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Standard success response format.

    Example:
    {
        "status": "success",
        "data": {...},
        "meta": {...}
    }
    """

    return {
        "status": "success",
        "data": data or {},
        "meta": meta or {}
    }


def error_response(
    code: str,
    message: str,
    details: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Standard error response format.

    Example:
    {
        "status": "error",
        "error": {
            "code": "INVALID_SIGNATURE",
            "message": "Signature verification failed",
            "details": {...}
        }
    }
    """

    error_payload = {
        "code": code,
        "message": message
    }

    if details:
        error_payload["details"] = details

    return {
        "status": "error",
        "error": error_payload
    }