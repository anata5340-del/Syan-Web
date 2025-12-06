"use client";

import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { marked } from "marked";

interface RichTextEditorProps {
  value: string; // HTML content (or Markdown for backward compatibility)
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
  const lastValueRef = useRef<string>("");

  // Detect if content is HTML or Markdown (for backward compatibility)
  const isHtml = (content: string): boolean => {
    if (!content) return false;
    // Check for HTML tags
    const htmlTagPattern = /<[a-z][\s\S]*>/i;
    return htmlTagPattern.test(content);
  };

  // Convert markdown to HTML for TinyMCE (for backward compatibility with existing Markdown content)
  const markdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    try {
      return marked.parse(markdown) as string;
    } catch (error) {
      console.error("Error converting markdown to HTML:", error);
      return markdown;
    }
  };

  // Get HTML content - either use value directly if HTML, or convert from Markdown
  const getHtmlContent = (content: string): string => {
    if (!content) return "";
    if (isHtml(content)) {
      return content; // Already HTML, use directly
    }
    // It's Markdown, convert to HTML for backward compatibility
    return markdownToHtml(content);
  };

  const handleEditorChange = (content: string) => {
    // Store HTML directly instead of converting to Markdown
    if (content !== lastValueRef.current) {
      lastValueRef.current = content;
      onChange(content); // Pass HTML directly
    }
  };

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      const html = getHtmlContent(value);
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
          // Set initial content (HTML or converted from Markdown for backward compatibility)
          const html = getHtmlContent(value);
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
            "link image | code | removeformat | fullscreen | help",
          content_style:
            "body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; }",
          placeholder: placeholder,
          readonly: readOnly,
          branding: false,
          promotion: false,
          resize: false,
          statusbar: false,
          // Preserve inline styles including colors
          valid_elements: "*[*]",
          extended_valid_elements: "*[*]",
          // Ensure inline styles are preserved
          keep_styles: true,
          // Preserve formatting when pasting
          paste_as_text: false,
          paste_retain_style_properties:
            "color font-size font-family background-color",
        }}
      />
    </div>
  );
};

export default RichTextEditor;
