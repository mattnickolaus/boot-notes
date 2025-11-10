from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import html2text
import pyperclip
import re

app = Flask(__name__)

@app.route("/extract", methods=["POST"])
def extract_markdown():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "Missing URL"}), 400

    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    lesson_div = soup.select_one("div#markdown-side")

    if not lesson_div:
        return jsonify({"error": "Lesson content not found"}), 404

    # (your same extraction logic here)
    for tag in lesson_div.select("button, svg, input"):
        tag.decompose()

    for pre in lesson_div.select("pre code"):
        classes = pre.get("class") or []
        lang = next((cls.split("language-")[-1] for cls in classes if cls.startswith("language-")), "")
        code_text = pre.get_text().strip()
        fenced_code = f"\n```{lang}\n{code_text}\n```\n"
        pre.replace_with(fenced_code)

    for img in lesson_div.select("img"):
        src = img.get("src", "")
        alt = img.get("alt", "")
        img.replace_with(f"![{alt}]({src})")

    for video in lesson_div.select("video"):
        source_tag = video.find("source")
        src = source_tag.get("src", "") if source_tag else video.get("src", "")
        if src:
            video.replace_with(f"[Video]({src})")
        else:
            video.decompose()

    converter = html2text.HTML2Text()
    converter.ignore_links = False
    converter.ignore_images = True
    converter.body_width = 0
    markdown_text = converter.handle(str(lesson_div))
    markdown_text = re.sub(r"^[ \t]+```", "```", markdown_text, flags=re.MULTILINE).strip()

    pyperclip.copy(markdown_text)
    return jsonify({"success": True, "markdown": markdown_text})

if __name__ == "__main__":
    app.run(port=5000)

