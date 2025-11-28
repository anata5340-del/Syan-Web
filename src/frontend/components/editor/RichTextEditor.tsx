"use client";

import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { marked } from "marked";
import TurndownService from "turndown";

interface RichTextEditorProps {
  value: string; // Markdown content
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = 200,
  placeholder = "Start typing...",
}) => {
  const editorRef = useRef<any>(null);
  const turndownService = useRef(new TurndownService());
  const lastValueRef = useRef<string>("");

  // Convert markdown to HTML for TinyMCE
  const markdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    try {
      return marked.parse(markdown) as string;
    } catch (error) {
      console.error("Error converting markdown to HTML:", error);
      return markdown;
    }
  };

  // Convert HTML to markdown for saving
  const htmlToMarkdown = (html: string): string => {
    if (!html || html === "<p></p>") return "";
    try {
      return turndownService.current.turndown(html);
    } catch (error) {
      console.error("Error converting HTML to markdown:", error);
      return html;
    }
  };

  const handleEditorChange = (content: string) => {
    const markdown = htmlToMarkdown(content);
    if (markdown !== lastValueRef.current) {
      lastValueRef.current = markdown;
      onChange(markdown);
    }
  };

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      const html = markdownToHtml(value);
      const currentContent = editorRef.current.getContent();
      if (currentContent !== html) {
        editorRef.current.setContent(html);
        lastValueRef.current = value;
      }
    }
  }, [value]);

  return (
    <div className="rich-text-editor-wrapper" style={{ height: `${height}px` }}>
      <style jsx global>{`
        .rich-text-editor-wrapper {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          overflow: hidden;
        }

        .rich-text-editor-wrapper:focus-within {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .tox-tinymce {
          border: none !important;
        }
      `}</style>
      <Editor
        apiKey="kiaz73368qvsu6hvps8qla5p3iiqnd2or78tzp3o24wlqmzf"
        onInit={(evt, editor) => {
          editorRef.current = editor;
          // Set initial content from markdown
          const html = markdownToHtml(value);
          editor.setContent(html);
          lastValueRef.current = value;
        }}
        onEditorChange={handleEditorChange}
        init={{
          height: height - 2,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "emoticons",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic underline strikethrough | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist | outdent indent | " +
            "link image | code | removeformat | help",
          content_style:
            "body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; }",
          placeholder: placeholder,
          readonly: readOnly,
          branding: false,
          promotion: false,
          resize: false,
          statusbar: false,
        }}
      />
    </div>
  );
};

export default RichTextEditor;

