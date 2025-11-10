import re
from bs4 import BeautifulSoup
import sys
import pyperclip
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import html2text

def main(args):

    url = ""
    if len(args) > 0:
        if len(args) != 1:
            print("Must provide a single argument: the URL of the lesson")
            return
        url = args[0]
    else:
        print("No arguments provided.")
        return

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=chrome_options)

    driver.get(url)

    page_source = driver.page_source

    soup = BeautifulSoup(page_source, 'html.parser')
    lesson_div = soup.select_one('div#markdown-side')


    if lesson_div:
        for tag in lesson_div.select("button, svg, input"):
            tag.decompose()

        # <pre><code> blocks 
        for pre in lesson_div.select("pre code"):
            classes = pre.get("class") or []
            lang = next((cls.split("language-")[-1] for cls in classes if cls.startswith("language-")), "")
            code_text = pre.get_text().strip()
            fenced_code = f"\n```{lang}\n{code_text}\n```\n"
            pre.replace_with(fenced_code)


        # images
        for img in lesson_div.select("img"):
            src = img.get("src", "")
            alt = img.get("alt", "")
            markdown_img = f"![{alt}]({src})"
            img.replace_with(markdown_img)

        # videos
        for video in lesson_div.select("video"):
            # Get the <source> tag if present
            source_tag = video.find("source")
            src = source_tag.get("src", "") if source_tag else video.get("src", "")
            if src:
                markdown_video = f"[Video]({src})"
                video.replace_with(markdown_video)
            else:
                video.decompose()

        converter = html2text.HTML2Text()
        converter.ignore_links = True
        converter.ignore_images = True
        converter.body_width = 0  # original line breaks

        markdown_text = converter.handle(str(lesson_div))

        # remove indentation before code blocks
        markdown_text = re.sub(r"^[ \t]+```", "```", markdown_text, flags=re.MULTILINE)
        # Collapse multiple newlines
        markdown_text = re.sub(r"\n{3,}", "\n\n", markdown_text).strip()

        pyperclip.copy(markdown_text)

        print("Lesson copied to clipboard:\n")
        print(markdown_text)
    else:
        print("could not find div with id='markdown-side'")


    driver.quit()


if __name__ == "__main__":
    main(sys.argv[1:])


