"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { marked } from "marked";
import { TurndownService } from "turndown";
import { Button } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CodeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface TiptapEditorProps {
  value: string; // Markdown content
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  placeholder?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = 200,
  placeholder = "Start typing...",
}) => {
  // Convert markdown to HTML for Tiptap
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
    if (!html) return "";
    try {
      const turndownService = new TurndownService();
      return turndownService.turndown(html);
    } catch (error) {
      console.error("Error converting HTML to markdown:", error);
      return html;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: markdownToHtml(value),
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4",
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHtml = editor.getHTML();
      const newHtml = markdownToHtml(value);
      
      // Only update if the content is different to avoid infinite loops
      if (currentHtml !== newHtml) {
        editor.commands.setContent(newHtml, false);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-editor-wrapper">
      {!readOnly && (
        <div className="tiptap-toolbar">
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("bold") ? "is-active" : ""
              }`}
              title="Bold"
            >
              <BoldOutlined />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("italic") ? "is-active" : ""
              }`}
              title="Italic"
            >
              <ItalicOutlined />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("strike") ? "is-active" : ""
              }`}
              title="Strikethrough"
            >
              <span style={{ textDecoration: "line-through" }}>S</span>
            </button>
          </div>
          <div className="tiptap-toolbar-divider"></div>
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`tiptap-toolbar-button ${
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`tiptap-toolbar-button ${
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`tiptap-toolbar-button ${
                editor.isActive("heading", { level: 3 }) ? "is-active" : ""
              }`}
              title="Heading 3"
            >
              H3
            </button>
          </div>
          <div className="tiptap-toolbar-divider"></div>
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("bulletList") ? "is-active" : ""
              }`}
              title="Bullet List"
            >
              <UnorderedListOutlined />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("orderedList") ? "is-active" : ""
              }`}
              title="Numbered List"
            >
              <OrderedListOutlined />
            </button>
          </div>
          <div className="tiptap-toolbar-divider"></div>
          <div className="tiptap-toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("code") ? "is-active" : ""
              }`}
              title="Inline Code"
            >
              <CodeOutlined />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("codeBlock") ? "is-active" : ""
              }`}
              title="Code Block"
            >
              &lt;/&gt;
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`tiptap-toolbar-button ${
                editor.isActive("blockquote") ? "is-active" : ""
              }`}
              title="Quote"
            >
              <FileTextOutlined />
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        .tiptap-editor-wrapper {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          background: #fff;
          min-height: ${height}px;
          max-height: ${height}px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .tiptap-toolbar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px;
          border-bottom: 1px solid #d9d9d9;
          background: #fafafa;
          flex-wrap: wrap;
        }

        .tiptap-toolbar-group {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .tiptap-toolbar-divider {
          width: 1px;
          height: 20px;
          background: #d9d9d9;
          margin: 0 4px;
        }

        .tiptap-toolbar-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          padding: 0;
          border: 1px solid transparent;
          border-radius: 4px;
          background: transparent;
          color: #595959;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .tiptap-toolbar-button:hover {
          background: #f5f5f5;
          border-color: #d9d9d9;
          color: #262626;
        }

        .tiptap-toolbar-button:active {
          background: #e6f7ff;
          border-color: #91d5ff;
        }

        .tiptap-toolbar-button.is-active {
          background: #e6f7ff;
          border-color: #91d5ff;
          color: #1890ff;
        }

        .tiptap-toolbar-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .tiptap-toolbar-button:disabled:hover {
          background: transparent;
          border-color: transparent;
        }

        .tiptap-editor-content {
          flex: 1;
          overflow-y: auto;
        }

        .tiptap-editor-wrapper:focus-within {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .tiptap-editor-wrapper[data-readonly="true"] {
          background: #fafafa;
          cursor: default;
          border-color: #d9d9d9;
        }
        
        .tiptap-editor-wrapper[data-readonly="true"] .ProseMirror {
          cursor: default;
        }

        .tiptap-editor-content .ProseMirror {
          outline: none;
          min-height: ${height - 80}px;
          padding: 12px;
        }

        .ProseMirror p {
          margin: 0.5em 0;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #bfbfbf;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h1 {
          font-size: 2em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .ProseMirror code {
          background-color: #f5f5f5;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }

        .ProseMirror pre {
          background-color: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 0.5em 0;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #d9d9d9;
          padding-left: 1em;
          margin: 0.5em 0;
          color: #666;
        }

        .ProseMirror strong {
          font-weight: 600;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror a {
          color: #1890ff;
          text-decoration: underline;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
      `}</style>
      <div data-readonly={readOnly} className="tiptap-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;

