<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Sitemap — Global Moves Network</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafa;
            color: #1a1a1a;
            line-height: 1.6;
          }
          .header {
            background: linear-gradient(135deg, #0d9488, #0f766e);
            color: #fff;
            padding: 2.5rem 2rem;
            text-align: center;
          }
          .header h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .header p {
            font-size: 0.95rem;
            opacity: 0.85;
          }
          .container {
            max-width: 960px;
            margin: 2rem auto;
            padding: 0 1.5rem;
          }
          .count {
            font-size: 0.85rem;
            color: #555;
            margin-bottom: 1rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          }
          th {
            background: #0d9488;
            color: #fff;
            text-align: left;
            padding: 0.75rem 1rem;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          td {
            padding: 0.65rem 1rem;
            border-bottom: 1px solid #eef2f2;
            font-size: 0.9rem;
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #f0fdfa; }
          td a {
            color: #0d9488;
            text-decoration: none;
            font-weight: 500;
          }
          td a:hover { text-decoration: underline; }
          .priority-high { color: #0d9488; font-weight: 700; }
          .priority-med { color: #d97706; font-weight: 600; }
          .priority-low { color: #6b7280; }
          .footer {
            text-align: center;
            padding: 2rem;
            font-size: 0.8rem;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Global Moves Network</h1>
          <p>XML Sitemap</p>
        </div>
        <div class="container">
          <p class="count">
            <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
          </p>
          <table>
            <tr>
              <th>URL</th>
              <th>Priority</th>
              <th>Change Freq</th>
            </tr>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <xsl:sort select="sitemap:priority" order="descending"/>
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                </td>
                <td>
                  <xsl:choose>
                    <xsl:when test="sitemap:priority &gt;= 0.8">
                      <xsl:attribute name="class">priority-high</xsl:attribute>
                    </xsl:when>
                    <xsl:when test="sitemap:priority &gt;= 0.6">
                      <xsl:attribute name="class">priority-med</xsl:attribute>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:attribute name="class">priority-low</xsl:attribute>
                    </xsl:otherwise>
                  </xsl:choose>
                  <xsl:value-of select="sitemap:priority"/>
                </td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </div>
        <div class="footer">
          © 2025 Global Moves Network
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
