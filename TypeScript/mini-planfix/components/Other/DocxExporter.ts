import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

const parseHtmlToDocx = (html: string): Paragraph[] => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const paragraphs: Paragraph[] = [];

    Array.from(tempDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun({ text: node.textContent || "" })],
                })
            );
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;

            switch (element.tagName) {
                case "P":
                    paragraphs.push(
                        new Paragraph({
                            children: [new TextRun({ text: element.innerText })],
                        })
                    );
                    break;
                case "B":
                case "STRONG":
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: element.innerText, bold: true }),
                            ],
                        })
                    );
                    break;
                case "I":
                case "EM":
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: element.innerText, italics: true }),
                            ],
                        })
                    );
                    break;
                case "BR":
                    paragraphs.push(new Paragraph({}));
                    break;
                case "UL":
                    element.querySelectorAll("li").forEach((li) => {
                        paragraphs.push(
                            new Paragraph({
                                text: li.innerText,
                                bullet: { level: 0 },
                            })
                        );
                    });
                    break;
                case "A":
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: element.innerText,
                                    color: "0000FF",
                                    underline: { type: "single"},
                                }),
                            ],
                        })
                    );
                    break;
                case "IMG":
                    const src = element.getAttribute("src");
                    if (src) {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `[Image: ${src}]`,
                                        italics: true,
                                        color: "808080",
                                    }),
                                ],
                            })
                        );
                    }
                    break;
                default:
                    paragraphs.push(
                        new Paragraph({
                            children: [new TextRun({ text: element.innerText })],
                        })
                    );
            }
        }
    });

    return paragraphs;
};

export const exportTaskAsDocx = async (task: {
    name: string;
    project?: string;
    description?: string;
}) => {
    const { name, project, description } = task;

    const parsedDescription = parseHtmlToDocx(description || "Описание отсутствует");

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Задача: ${name}`, bold: true, size: 28 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Проект: ${project || "Без проекта"}`,
                                italics: true,
                            }),
                        ],
                    }),
                    ...parsedDescription,
                ],
            },
        ],
    });

    try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${name}.docx`);
    } catch (error) {
        console.error("Ошибка при генерации файла DOCX:", error);
    }
};
