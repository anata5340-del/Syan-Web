"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalEditor as LexicalEditorType, EditorState } from "lexical";
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { $isHeadingNode, $isQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $isListNode, ListItemNode, ListNode } from "@lexical/list";
import { $createListNode, $createListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { $createCodeNode } from "@lexical/code";
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $createParagraphNode, $getRoot, $isParagraphNode } from "lexical";
import { $convertFromMarkdownString, $convertToMarkdownString } from "@lexical/markdown";
import { TRANSFORMERS } from "@lexical/markdown";
import { Select, Button, Dropdown, Input, Popover } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CodeOutlined,
  FileTextOutlined,
  UndoOutlined,
  RedoOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface LexicalEditorProps {
  value: string; // Markdown content
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  placeholder?: string;
}

// Toolbar component with full options
const ToolbarPlugin: React.FC<{ readOnly: boolean }> = ({ readOnly }) => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [fontSize, setFontSize] = useState("15px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }

    const anchorNode = selection?.anchor.getNode();
    let element =
      anchorNode?.getKey() === "root"
        ? anchorNode
        : anchorNode?.getTopLevelElementOrThrow();
    const elementKey = element.getKey();
    const elementDOM = editor.getElementByKey(elementKey);

    if (elementDOM !== null) {
      if ($isListNode(element)) {
        const parentList = $isListNode(element) ? element : element.getParent();
        if (parentList !== null) {
          const listType = parentList.getListType();
          setBlockType(listType);
        }
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : $isQuoteNode(element)
          ? "quote"
          : element.getType();
        if (type in ["h1", "h2", "h3", "h4", "h5", "h6"]) {
          setBlockType(type);
        } else if (type === "quote") {
          setBlockType("quote");
        } else {
          setBlockType("paragraph");
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        setCanUndo(editor.getEditorState().read(() => {
          return editor.getEditorState()._historyState?.undoStack?.length > 0;
        }));
        setCanRedo(editor.getEditorState().read(() => {
          return editor.getEditorState()._historyState?.redoStack?.length > 0;
        }));
      });
    });
  }, [editor]);

  const formatBold = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }, [editor]);

  const formatItalic = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }, [editor]);

  const formatUnderline = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }, [editor]);

  const formatStrikethrough = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  }, [editor]);

  const formatHeading = useCallback(
    (headingSize: HeadingTagType | "paragraph" | "quote") => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (headingSize === "paragraph") {
            const paragraph = $createParagraphNode();
            selection.insertNodes([paragraph]);
          } else if (headingSize === "quote") {
            const quote = $createQuoteNode();
            selection.insertNodes([quote]);
          } else {
            const heading = $createHeadingNode(headingSize as HeadingTagType);
            selection.insertNodes([heading]);
          }
        }
      });
    },
    [editor]
  );

  const formatBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const formatOrderedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const formatCode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const code = $createCodeNode();
        selection.insertNodes([code]);
      }
    });
  }, [editor]);

  const formatQuote = useCallback(() => {
    formatHeading("quote");
  }, [formatHeading]);

  const formatAlignment = useCallback(
    (alignment: "left" | "center" | "right" | "justify") => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    },
    [editor]
  );

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  }, [editor]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // For now, insert as markdown image syntax
          const imageMarkdown = `![Image](${url})`;
          const textNode = selection.anchor.getNode();
          if (textNode) {
            textNode.setTextContent(imageMarkdown);
          }
        }
      });
    }
  }, [editor]);

  const undo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const redo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  if (readOnly) {
    return null;
  }

  const blockTypeOptions = [
    { label: "Normal", value: "paragraph" },
    { label: "Heading 1", value: "h1" },
    { label: "Heading 2", value: "h2" },
    { label: "Heading 3", value: "h3" },
    { label: "Heading 4", value: "h4" },
    { label: "Heading 5", value: "h5" },
    { label: "Heading 6", value: "h6" },
    { label: "Quote", value: "quote" },
  ];

  const fontFamilyOptions = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Verdana", value: "Verdana" },
    { label: "Georgia", value: "Georgia" },
    { label: "Helvetica", value: "Helvetica" },
  ];

  const fontSizeOptions = [
    { label: "10px", value: "10px" },
    { label: "12px", value: "12px" },
    { label: "14px", value: "14px" },
    { label: "15px", value: "15px" },
    { label: "16px", value: "16px" },
    { label: "18px", value: "18px" },
    { label: "20px", value: "20px" },
    { label: "24px", value: "24px" },
    { label: "28px", value: "28px" },
    { label: "32px", value: "32px" },
  ];

  const insertMenuItems = [
    {
      key: "image",
      label: (
        <div onClick={insertImage}>
          <PictureOutlined /> Image
        </div>
      ),
    },
    {
      key: "link",
      label: (
        <div onClick={insertLink}>
          <LinkOutlined /> Link
        </div>
      ),
    },
  ];

  return (
    <div className="lexical-toolbar">
      <div className="lexical-toolbar-group">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="lexical-toolbar-button"
          title="Undo"
        >
          <UndoOutlined />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="lexical-toolbar-button"
          title="Redo"
        >
          <RedoOutlined />
        </button>
      </div>
      <div className="lexical-toolbar-divider"></div>
      <div className="lexical-toolbar-group">
        <Select
          value={blockType}
          onChange={formatHeading}
          style={{ width: 120, fontSize: "12px" }}
          size="small"
          options={blockTypeOptions}
        />
      </div>
      <div className="lexical-toolbar-divider"></div>
      <div className="lexical-toolbar-group">
        <Select
          value={fontFamily}
          onChange={setFontFamily}
          style={{ width: 140, fontSize: "12px" }}
          size="small"
          options={fontFamilyOptions}
        />
      </div>
      <div className="lexical-toolbar-group">
        <Select
          value={fontSize}
          onChange={setFontSize}
          style={{ width: 80, fontSize: "12px" }}
          size="small"
          options={fontSizeOptions}
        />
      </div>
      <div className="lexical-toolbar-divider"></div>
      <div className="lexical-toolbar-group">
        <button
          type="button"
          onClick={formatBold}
          className={`lexical-toolbar-button ${isBold ? "is-active" : ""}`}
          title="Bold"
        >
          <BoldOutlined />
        </button>
        <button
          type="button"
          onClick={formatItalic}
          className={`lexical-toolbar-button ${isItalic ? "is-active" : ""}`}
          title="Italic"
        >
          <ItalicOutlined />
        </button>
        <button
          type="button"
          onClick={formatUnderline}
          className={`lexical-toolbar-button ${isUnderline ? "is-active" : ""}`}
          title="Underline"
        >
          <UnderlineOutlined />
        </button>
        <button
          type="button"
          onClick={formatStrikethrough}
          className={`lexical-toolbar-button ${isStrikethrough ? "is-active" : ""}`}
          title="Strikethrough"
        >
          <span style={{ textDecoration: "line-through" }}>S</span>
        </button>
        <button
          type="button"
          onClick={formatCode}
          className="lexical-toolbar-button"
          title="Code"
        >
          <CodeOutlined />
        </button>
        <button
          type="button"
          onClick={insertLink}
          className="lexical-toolbar-button"
          title="Link"
        >
          <LinkOutlined />
        </button>
      </div>
      <div className="lexical-toolbar-divider"></div>
      <div className="lexical-toolbar-group">
        <Popover
          content={
            <div style={{ padding: "8px" }}>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                style={{ width: "100%", height: "30px" }}
              />
            </div>
          }
          trigger="click"
          title="Text Color"
        >
          <button
            type="button"
            className="lexical-toolbar-button"
            title="Text Color"
            style={{ position: "relative" }}
          >
            <span style={{ color: textColor, fontWeight: "bold" }}>A</span>
          </button>
        </Popover>
        <Popover
          content={
            <div style={{ padding: "8px" }}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{ width: "100%", height: "30px" }}
              />
            </div>
          }
          trigger="click"
          title="Background Color"
        >
          <button
            type="button"
            className="lexical-toolbar-button"
            title="Background Color"
          >
            <span
              style={{
                backgroundColor: bgColor,
                color: "#000",
                padding: "2px 4px",
                borderRadius: "2px",
              }}
            >
              Aa
            </span>
          </button>
        </Popover>
      </div>
      <div className="lexical-toolbar-divider"></div>
      <div className="lexical-toolbar-group">
        <Dropdown menu={{ items: insertMenuItems }} trigger={["click"]}>
          <button
            type="button"
            className="lexical-toolbar-button"
            title="Insert"
          >
            <PlusOutlined /> Insert
          </button>
        </Dropdown>
      </div>
      <div className="lexical-toolbar-divider"></div>
      <div className="lexical-toolbar-group">
        <button
          type="button"
          onClick={() => formatAlignment("left")}
          className="lexical-toolbar-button"
          title="Align Left"
        >
          <AlignLeftOutlined />
        </button>
        <button
          type="button"
          onClick={() => formatAlignment("center")}
          className="lexical-toolbar-button"
          title="Align Center"
        >
          <AlignCenterOutlined />
        </button>
        <button
          type="button"
          onClick={() => formatAlignment("right")}
          className="lexical-toolbar-button"
          title="Align Right"
        >
          <AlignRightOutlined />
        </button>
      </div>
      <div className="lexical-toolbar-divider"></div>
      <div className="lexical-toolbar-group">
        <button
          type="button"
          onClick={formatBulletList}
          className="lexical-toolbar-button"
          title="Bullet List"
        >
          <UnorderedListOutlined />
        </button>
        <button
          type="button"
          onClick={formatOrderedList}
          className="lexical-toolbar-button"
          title="Numbered List"
        >
          <OrderedListOutlined />
        </button>
        <button
          type="button"
          onClick={formatQuote}
          className="lexical-toolbar-button"
          title="Quote"
        >
          <FileTextOutlined />
        </button>
      </div>
    </div>
  );
};

// Plugin to load initial markdown content
const MarkdownLoadPlugin: React.FC<{ markdown: string }> = ({ markdown }) => {
  const [editor] = useLexicalComposerContext();
  const [lastMarkdown, setLastMarkdown] = useState<string>("");

  useEffect(() => {
    if (markdown !== lastMarkdown) {
      editor.update(() => {
        $convertFromMarkdownString(markdown || "", TRANSFORMERS);
      });
      setLastMarkdown(markdown);
    }
  }, [editor, markdown, lastMarkdown]);

  return null;
};

const LexicalEditor: React.FC<LexicalEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = 200,
  placeholder = "Start typing...",
}) => {
  const initialConfig = {
    namespace: "LexicalEditor",
    theme: {
      paragraph: "lexical-paragraph",
      heading: {
        h1: "lexical-heading-h1",
        h2: "lexical-heading-h2",
        h3: "lexical-heading-h3",
        h4: "lexical-heading-h4",
        h5: "lexical-heading-h5",
        h6: "lexical-heading-h6",
      },
      list: {
        ul: "lexical-list-ul",
        ol: "lexical-list-ol",
        listitem: "lexical-list-item",
      },
      code: "lexical-code",
      codeHighlight: "lexical-code-highlight",
      quote: "lexical-quote",
      text: {
        bold: "lexical-text-bold",
        italic: "lexical-text-italic",
        underline: "lexical-text-underline",
        strikethrough: "lexical-text-strikethrough",
      },
      link: "lexical-link",
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
    ],
    editable: !readOnly,
    onError: (error: Error) => {
      console.error("Lexical error:", error);
    },
  };

  const handleChange = useCallback(
    (editorState: EditorState, editor: LexicalEditorType) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onChange(markdown);
      });
    },
    [onChange]
  );

  return (
    <div className="lexical-editor-wrapper" style={{ height: `${height}px` }}>
      <style jsx global>{`
        .lexical-editor-wrapper {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          background: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .lexical-editor-wrapper:focus-within {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .lexical-editor-wrapper[data-readonly="true"] {
          background: #fafafa;
          border-color: #d9d9d9;
        }

        .lexical-toolbar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px;
          border-bottom: 1px solid #d9d9d9;
          background: #fafafa;
          flex-wrap: wrap;
          min-height: 48px;
        }

        .lexical-toolbar-group {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .lexical-toolbar-divider {
          width: 1px;
          height: 20px;
          background: #d9d9d9;
          margin: 0 4px;
        }

        .lexical-toolbar-button {
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

        .lexical-toolbar-button:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: #d9d9d9;
          color: #262626;
        }

        .lexical-toolbar-button:active {
          background: #e6f7ff;
          border-color: #91d5ff;
        }

        .lexical-toolbar-button.is-active {
          background: #e6f7ff;
          border-color: #91d5ff;
          color: #1890ff;
        }

        .lexical-toolbar-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .lexical-editor-content {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          min-height: ${height - 100}px;
          position: relative;
        }

        .lexical-content-editable {
          outline: none;
          min-height: ${height - 120}px;
        }

        .lexical-placeholder {
          position: absolute;
          top: 12px;
          left: 12px;
          color: #bfbfbf;
          pointer-events: none;
          font-size: 14px;
        }

        .lexical-paragraph {
          margin: 0.5em 0;
        }

        .lexical-heading-h1 {
          font-size: 2em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .lexical-heading-h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .lexical-heading-h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .lexical-heading-h4 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .lexical-heading-h5 {
          font-size: 1em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .lexical-heading-h6 {
          font-size: 0.9em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .lexical-list-ul,
        .lexical-list-ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .lexical-list-item {
          margin: 0.25em 0;
        }

        .lexical-code {
          background-color: #f5f5f5;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }

        .lexical-code-highlight {
          background-color: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 0.5em 0;
          font-family: monospace;
        }

        .lexical-quote {
          border-left: 4px solid #d9d9d9;
          padding-left: 1em;
          margin: 0.5em 0;
          color: #666;
          font-style: italic;
        }

        .lexical-text-bold {
          font-weight: 600;
        }

        .lexical-text-italic {
          font-style: italic;
        }

        .lexical-text-underline {
          text-decoration: underline;
        }

        .lexical-text-strikethrough {
          text-decoration: line-through;
        }

        .lexical-link {
          color: #1890ff;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="lexical-editor-content" data-readonly={readOnly}>
          {!readOnly && <ToolbarPlugin readOnly={readOnly} />}
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="lexical-content-editable" />
            }
            placeholder={
              <div className="lexical-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
          <MarkdownLoadPlugin markdown={value} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;
