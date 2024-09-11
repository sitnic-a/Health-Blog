using System.IO;
using iText.Kernel.Colors;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Utils
{
    public class PDFGenerators
    {
        public async Task<byte[]> CreatePdfFile(List<PostDto> posts)
        {
                string currentDir = Environment.CurrentDirectory;
                string fileDirectory = System.IO.Directory.GetCurrentDirectory();
                DirectoryInfo directory = new DirectoryInfo(
                    System.IO.Path.GetFullPath(System.IO.Path.Combine(currentDir, "pdfs\\" + $"{DateTime.Now.Minute.ToString()}-{DateTime.Now.Millisecond}.pdf")));

                if (Directory.Exists(directory.Parent?.Name))
                {
                    PdfWriter writer = new PdfWriter(directory.FullName);
                    PdfDocument pdfDoc = new PdfDocument(writer);

                    Document doc = new Document(pdfDoc);

                    for (int i = 0; i < posts.Count; i++)
                    {
                        Div postContainer = new Div();
                        postContainer
                            .SetMaxWidth(200)
                            .SetHorizontalAlignment(HorizontalAlignment.CENTER);

                        Div postTitleContainer = new Div();
                        postTitleContainer
                            .SetMarginTop(10)
                            .SetMarginBottom(10)
                            .SetBorderRadius(new BorderRadius(3))
                            .SetBackgroundColor(ColorConstants.ORANGE)
                            .SetFontColor(ColorConstants.WHITE);

                        Div postContentContainer = new Div();
                        postContentContainer
                            .SetMargin(5)
                            .SetWidth(200)
                            .SetBackgroundColor(ColorConstants.WHITE);

                        Div postTagsContainer = new Div();
                        postTagsContainer
                            .SetMaxWidth(200)
                            .SetPadding(5);

                        string postTitleText = posts[i].Title;
                        string postContentText = posts[i].Content;
                        List<string> tags = posts[i].Tags;


                        Paragraph titleParagraph = new Paragraph(postTitleText.ToString());
                        titleParagraph
                            .SetFontSize(10)
                            .SetTextAlignment(TextAlignment.CENTER)
                            .SetBackgroundColor(ColorConstants.ORANGE)
                            .SetFontColor(ColorConstants.WHITE)
                            .SetPadding(2);

                        Paragraph contentParagraph = new Paragraph(postContentText.ToString());
                        contentParagraph
                            .SetFontSize(8)
                            .SetPadding(2);

                        Paragraph postTagsParagraph = new Paragraph();
                        for (int j = 0; j < tags.Count; j++)
                        {
                            postTagsParagraph
                                .Add($@"#{tags[j]}  ")
                                .SetFontSize(8)
                                .SetMarginLeft(2);
                        }

                        postTitleContainer.Add(titleParagraph);
                        postContentContainer.Add(contentParagraph);
                        postTagsContainer.Add(postTagsParagraph);

                        postContainer.Add(postTitleContainer);
                        postContainer.Add(postContentContainer);
                        postContainer.Add(postTagsContainer);

                        doc.Add(postContainer);
                    }

                    doc.Close();

                    var pdf = await File.ReadAllBytesAsync(directory.FullName);
                    return pdf;

                }
                else
                {
                    Directory.CreateDirectory($@"{currentDir}\pdfs");

                    PdfWriter writer = new PdfWriter(directory.FullName);
                    PdfDocument pdfDoc = new PdfDocument(writer);

                    Document doc = new Document(pdfDoc);

                    for (int i = 0; i < posts.Count; i++)
                    {
                        Div postContainer = new Div();
                        postContainer
                            .SetMaxWidth(200)
                            .SetHorizontalAlignment(HorizontalAlignment.CENTER);

                        Div postTitleContainer = new Div();
                        postTitleContainer
                            .SetMarginTop(10)
                            .SetMarginBottom(10)
                            .SetBorderRadius(new BorderRadius(3))
                            .SetBackgroundColor(ColorConstants.ORANGE)
                            .SetFontColor(ColorConstants.WHITE);

                        Div postContentContainer = new Div();
                        postContentContainer
                            .SetMargin(5)
                            .SetWidth(200)
                            .SetBackgroundColor(ColorConstants.WHITE);

                        Div postTagsContainer = new Div();
                        postTagsContainer
                            .SetMaxWidth(200)
                            .SetPadding(5);

                        string postTitleText = posts[i].Title;
                        string postContentText = posts[i].Content;
                        List<string> tags = posts[i].Tags;


                        Paragraph titleParagraph = new Paragraph(postTitleText.ToString());
                        titleParagraph
                            .SetFontSize(10)
                            .SetTextAlignment(TextAlignment.CENTER)
                            .SetBackgroundColor(ColorConstants.ORANGE)
                            .SetFontColor(ColorConstants.WHITE)
                            .SetPadding(2);

                        Paragraph contentParagraph = new Paragraph(postContentText.ToString());
                        contentParagraph
                            .SetFontSize(8)
                            .SetPadding(2);

                        Paragraph postTagsParagraph = new Paragraph();
                        for (int j = 0; j < tags.Count; j++)
                        {
                            postTagsParagraph
                                .Add($@"#{tags[j]}  ")
                                .SetFontSize(8)
                                .SetMarginLeft(2);
                        }

                        postTitleContainer.Add(titleParagraph);
                        postContentContainer.Add(contentParagraph);
                        postTagsContainer.Add(postTagsParagraph);

                        postContainer.Add(postTitleContainer);
                        postContainer.Add(postContentContainer);
                        postContainer.Add(postTagsContainer);

                        doc.Add(postContainer);
                    }

                    doc.Close();

                    var pdf = await File.ReadAllBytesAsync(directory.FullName);
                    return pdf;
                }
        }
    }
}
