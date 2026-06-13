import { useEffect, useRef } from "react";

interface AdsterraProps {
  keyId: string;
  width?: number;
  height?: number;
  format?: string;
  className?: string;
}

const Adsterra = ({
  keyId,
  width = 160,
  height = 300,
  format = "iframe",
  className = "",
}: AdsterraProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = `${height}px`;
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style>
          </head>
          <body>
            <script>
              window.atOptions = {
                key: '${keyId}',
                format: '${format}',
                height: ${height},
                width: ${width},
                params: {}
              };
            <\/script>
            <script src="https://www.highperformanceformat.com/${keyId}/invoke.js"><\/script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, [keyId, width, height, format]);

  return (
    <div
      ref={containerRef}
      className={`mx-auto overflow-hidden ${className}`}
      style={{ maxWidth: width }}
    />
  );
};

export default Adsterra;
