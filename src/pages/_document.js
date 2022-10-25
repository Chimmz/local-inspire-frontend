import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDoc() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://code.iconify.design/iconify-icon/1.0.1/iconify-icon.min.js"
          defer
        ></script>
      </Head>
      <div id="modal-root"></div>
      <div id="alerts-root"></div>
      <Main />
      <NextScript />
    </Html>
  );
}
