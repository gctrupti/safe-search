# safe-search

Short summary
-------------

`safe-search` is a reference implementation of a privacy-preserving encrypted search system.
It demonstrates two complementary search approaches:

- SSE (Symmetric Searchable Encryption) for internal authenticated analysts (AES-256-GCM + HMAC-based tokens).
- A PEKS-like external auditor flow using RSA signatures for auditor verification and padded encrypted result sets.

Repository layout
-----------------

- `backend/` — Django REST API (project: `securematch`) implementing storage, indexing, SSE search and external auditor APIs. See `backend/securematch/documents` for the app.
  - Models: `EncryptedDocument`, `SearchTokenIndex`, `Auditor`, `ExternalSearchAudit` (`backend/securematch/documents/models.py`).
  - Views / API endpoints: mounted under `/api/` via `backend/securematch/securematch/urls.py` and `backend/securematch/documents/urls.py`.
  - Crypto helpers (SSE & PEKS-like): `backend/securematch/crypto_engine/` (`sse.py`, `peks.py`, `key_manager.py`).
  - Requirements: `backend/requirements.txt` and `backend/Dockerfile` for containerized deployment.

- `frontend/` — React + Vite single-page app that talks to the backend. Main code in `frontend/src/` and services in `frontend/src/services/`.

Key backend API endpoints (path -> HTTP method)
----------------------------------------------
All endpoints are mounted under the `/api/` prefix.

- `upload/` -> POST : upload and AES-GCM encrypt a document and index searchable tokens.
- `search/internal/` -> POST : internal SSE search (trapdoor/HMAC tokens) — returns decrypted results.
- `search/external/` -> POST : external auditor search — verifies RSA signature, returns padded encrypted results and audit log data.
- `auditor/create/` -> POST : create an auditor entry and return one-time private key.
- `auditor/rotate-key/` -> POST : rotate/generate a new keypair for an auditor (key rotation support).
- `auditor/<auditor_id>/logs/` -> GET : list recent external search audit entries for an auditor.
- `auditor/<auditor_id>/delete/` -> DELETE : remove an auditor.
- `metrics/internal/` -> GET : internal system metrics + auditor list.
- `metrics/external/` -> GET : limited external metrics.

Crypto & secrets
-----------------
- SSE: `backend/securematch/crypto_engine/sse.py` uses a master key (HKDF-derived) to produce an AES-256 key and an HMAC key. Data is encrypted with AES-GCM.
- PEKS-like: `backend/securematch/crypto_engine/peks.py` provides deterministic keyword hashing and RSA signature verification used by auditors.
- Secret: `MASTER_KEY` environment variable is required for `key_manager.load_master_key()` (expects a base64 value that decodes to 32 bytes).

Database models
---------------
- `EncryptedDocument` — stores encrypted blob (nonce + ciphertext).
- `SearchTokenIndex` — stores internal HMAC tokens and external deterministic hashes mapping to documents.
- `Auditor` — stores auditor metadata and public key; supports key rotation.
- `ExternalSearchAudit` — records each external search request outcome and timings.

Frontend integration
--------------------
- The frontend uses `frontend/src/services/api.js` to centralize the backend base URL. By default it uses the configured base URL so all service modules (`uploadService`, `internalSearchService`, `externalSearchService`, `auditorService`) inherit it.
- To run the frontend locally:

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

Running the backend (local)
--------------------------
1. Create and activate a Python venv and install requirements:

	```bash
	cd backend
	python -m venv .venv
	source .venv/bin/activate
	pip install -r requirements.txt
	```

2. Provide a `MASTER_KEY` env var (base64 -> 32 bytes). Example (generate and export locally):

	```bash
	python - <<'PY'
	import os, base64
	print(base64.b64encode(os.urandom(32)).decode())
	PY
	export MASTER_KEY="<paste-the-generated-value>"
	```

3. Apply migrations and run:

	```bash
	python manage.py migrate
	python manage.py runserver
	```

Docker (backend)
----------------
- Build and run with the provided `backend/Dockerfile`. Ensure `MASTER_KEY` is injected into the container environment.

Notes & next steps
------------------
- Consider moving the frontend base URL into environment variables (`VITE_API_BASE_URL`) for easier configuration between dev/staging/production.
- The implementation is a reference/demo and not a production-ready hardened system — review key management, authentication, and operational security before production use.

Where to look in the codebase
----------------------------
- Backend entrypoints: `backend/securematch/securematch/urls.py` and `backend/securematch/documents/urls.py`.
- Core search & crypto: `backend/securematch/documents/views.py`, `backend/securematch/crypto_engine/`.
- Frontend code & services: `frontend/src/` and `frontend/src/services/`.

If you want, I can:
- Replace the hardcoded API base with a `VITE_API_BASE_URL` env var and update the README with instructions for using it.
- Add simple setup scripts to automate env generation and bootstrapping.
