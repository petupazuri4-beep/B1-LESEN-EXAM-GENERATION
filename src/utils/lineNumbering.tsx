import React from 'react';

/**
 * Line Numbering Generator for Reading Stimuli (Zeilennummerierung)
 * Formats German reading texts with 5-line interval margin numbers (5, 10, 15, 20, 25...)
 */

export interface LineNumberedParagraph {
  lines: Array<{
    lineNumber: number;
    text: string;
    isNumberedInterval: boolean;
  }>;
}

/**
 * Splits a German text into lines of roughly targetCharsPerLine (default ~65-75 chars for A4 reading column)
 * or based on explicit newlines, tracking line numbers.
 */
export function formatTextWithLineNumbers(
  rawText: string,
  interval: number = 5,
  approxCharsPerLine: number = 72,
  startLineNumber: number = 1
): {
  paragraphs: Array<Array<{ lineNumber: number; text: string; isNumberedInterval: boolean }>>;
  totalLines: number;
} {
  const rawParagraphs = rawText.split(/\n+/).filter(p => p.trim().length > 0);
  let currentLine = startLineNumber;
  const paragraphs: Array<Array<{ lineNumber: number; text: string; isNumberedInterval: boolean }>> = [];

  for (const para of rawParagraphs) {
    const words = para.trim().split(/\s+/);
    const paraLines: Array<{ lineNumber: number; text: string; isNumberedInterval: boolean }> = [];
    let currentLineWords: string[] = [];
    let currentLength = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (currentLength + word.length + 1 > approxCharsPerLine && currentLineWords.length > 0) {
        paraLines.push({
          lineNumber: currentLine,
          text: currentLineWords.join(' '),
          isNumberedInterval: currentLine % interval === 0,
        });
        currentLine++;
        currentLineWords = [word];
        currentLength = word.length;
      } else {
        currentLineWords.push(word);
        currentLength += (currentLineWords.length > 1 ? 1 : 0) + word.length;
      }
    }

    if (currentLineWords.length > 0) {
      paraLines.push({
        lineNumber: currentLine,
        text: currentLineWords.join(' '),
        isNumberedInterval: currentLine % interval === 0,
      });
      currentLine++;
    }

    paragraphs.push(paraLines);
  }

  return {
    paragraphs,
    totalLines: currentLine - 1,
  };
}

export interface LineNumberedTextProps {
  text: string;
  showLineNumbers?: boolean;
  interval?: number; // default 5
  className?: string;
  lineHeight?: number;
  highlightSearch?: string;
  startLineNumber?: number;
}

export const LineNumberedText: React.FC<LineNumberedTextProps> = ({
  text,
  showLineNumbers = true,
  interval = 5,
  className = '',
  lineHeight = 1.45,
  highlightSearch,
  startLineNumber = 1,
}) => {
  if (!showLineNumbers) {
    return (
      <div className={`space-y-3 ${className}`} style={{ lineHeight }}>
        {text.split('\n\n').map((p, idx) => (
          <p key={idx} className="text-justify indent-2">
            {p}
          </p>
        ))}
      </div>
    );
  }

  const { paragraphs } = formatTextWithLineNumbers(text, interval, 72, startLineNumber);

  return (
    <div className={`relative pl-7 text-xs font-normal select-text ${className}`} style={{ lineHeight }}>
      {paragraphs.map((para, pIdx) => (
        <div key={pIdx} className="mb-3">
          {para.map((line) => {
            const isHighlighted =
              highlightSearch && highlightSearch.trim().length > 3
                ? line.text.toLowerCase().includes(highlightSearch.toLowerCase().trim())
                : false;

            return (
              <div key={line.lineNumber} className="relative flex items-baseline group hover:bg-amber-50/50">
                {/* Margin Number Gutter */}
                <span
                  className={`absolute -left-7 w-5 text-right font-mono text-[9px] select-none ${
                    line.isNumberedInterval
                      ? 'text-neutral-500 font-bold opacity-100'
                      : 'text-neutral-300 opacity-0 group-hover:opacity-60'
                  }`}
                  aria-hidden="true"
                >
                  {line.lineNumber}
                </span>

                {/* Text Line */}
                <span
                  className={`flex-1 ${
                    isHighlighted ? 'bg-amber-200 text-amber-950 font-semibold px-0.5 rounded' : ''
                  }`}
                >
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
