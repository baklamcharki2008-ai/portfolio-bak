import os
from pathlib import Path
from urllib.parse import unquote

from flask import Flask, abort, redirect, send_from_directory
from werkzeug.exceptions import NotFound

BASE = Path(__file__).resolve().parent

SITES = {
    "bakrelamcharki-portfolio": BASE / "public" / "bakrelamcharki-portfolio",
    "vertex-corp": BASE / "public" / "vertex-corp",
}

app = Flask(__name__, static_folder=None)


@app.get("/")
def home():
    index = BASE / "public" / "index.html"
    if index.exists():
        return send_from_directory(BASE / "public", "index.html")
    return redirect("vertex-corp/", code=302)


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(SITES["bakrelamcharki-portfolio"], "favicon.svg")


@app.get("/google7aa7265463ab1fc9.html")
def google_verification():
    return send_from_directory(BASE / "public", "google7aa7265463ab1fc9.html")


@app.get("/<site>")
@app.get("/<site>/")
def site_index(site):
    root = SITES.get(site)
    if root is None:
        abort(404)
    return send_from_directory(root, "index.html")


@app.get("/<site>/<path:filename>")
def site_file(site, filename):
    root = SITES.get(site)
    if root is None:
        abort(404)
    try:
        return send_from_directory(root, unquote(filename))
    except NotFound:
        custom_404 = root / "404.html"
        if custom_404.exists():
            return send_from_directory(root, "404.html"), 404
        abort(404)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)