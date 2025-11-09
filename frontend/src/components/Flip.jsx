import React from "react";
import { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import book1 from '../book/book1.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Pages = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage" ref={ref}>
            <h1>Page Header</h1>
            <div>{props.children}</div>
            <p>Page number: {props.number}</p>
        </div>
    );
});
Pages.displayName = "Pages";

export function Flip(props) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center">
        <HTMLFlipBook width={300} height={500}>
            {
                [...Array(numPages).keys()].map(page => (
                    <Pages key={page} number={page}>
                        <Document file={book1} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={page+1} />
                        </Document>
                    </Pages>
                ))
            }
        </HTMLFlipBook>
        </div>
    );
}