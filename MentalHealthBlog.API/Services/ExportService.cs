using iText.Kernel.Colors;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Colorspace;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Layout.Renderer;
using MentalHealthBlog.API.Models.ResourceResponse;
using Org.BouncyCastle.Asn1.Cms;
using Org.BouncyCastle.Utilities;
using System.Drawing;
using System.IO;
using System.Text;

namespace MentalHealthBlog.API.Services
{
    public class ExportService : IExportService
    {
        public void ExportToPDF(List<PostDto> posts)
        {
            //string currentDir = Environment.CurrentDirectory;
            //DirectoryInfo directory = new DirectoryInfo(
            //    System.IO.Path.GetFullPath(System.IO.Path.Combine(currentDir, "pdfs\\test.pdf")));

            //PdfWriter writer = new PdfWriter(directory.FullName);
            //PdfDocument pdfDoc = new PdfDocument(writer);

            //Document doc = new Document(pdfDoc);

            //Rectangle[] columns =
            //{
            //    new Rectangle(100, 100, 100, 500),
            //    new Rectangle(400, 100, 100, 500)
            //};

            //// Set a renderer to create a layout consisted of two vertical rectangles created above
            //doc.SetRenderer(new ColumnDocumentRenderer(doc, columns));

            //StringBuilder text = new StringBuilder();
            //for (int i = 0; i < 200; i++)
            //{
            //    text.Append("A very long text is here...");
            //}

            //Paragraph paragraph = new Paragraph(text.ToString());
            //doc.Add(paragraph);

            //doc.Close();

            //Make PDF file

            //Return PDF file

            //Make controller 

            //Call method on frontend
        }

        public void ExportToPDF()
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

                Div postContainer = new Div();
                postContainer
                    .SetMaxWidth(200)
                    .SetBackgroundColor(ColorConstants.GRAY);

                Div postTitleContainer = new Div();
                postTitleContainer
                    .SetMargin(10)
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
                    .SetTextRenderingMode((int)FlexWrapPropertyValue.WRAP)
                    .SetPadding(2);

                string postTitleText = "Wonderful days!";
                string postContentText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus magnam dolorum sint in eum alias assumenda ab, " +
                    "voluptatum natus, a, illo neque. Eos praesentium non blanditiis facere. Pariatur laboriosam quia accusamus nobis dolores debitis sit nulla. " +
                    "Culpa alias esse, numquam maiores sequi a! Dolor natus necessitatibus eaque aspernatur provident ducimus quos magnam, quaerat veritatis tempore " +
                    "ad numquam eius laboriosam modi earum autem possimus ipsa voluptatem odit. Minima, deserunt reprehenderit voluptates consequuntur nesciunt dignissimos " +
                    "enim corporis, impedit recusandae ullam eligendi repellat?";
                string[] tags = { "Ljubav", "Radost", "Karijera", "Zadovoljstvo", "Prijatelji", "Porodica" };


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


                iText.Kernel.Geom.Rectangle[] columns =
            {
                new iText.Kernel.Geom.Rectangle(100, 100, 600, 500),
                new iText.Kernel.Geom.Rectangle(100, 0, 200, 500)
            };

                for (int i = 0; i < tags.Length; i++)
                {
                    Div tagContainer = new Div();
                    tagContainer
                        .SetMaxWidth(200)
                        .SetBackgroundColor(ColorConstants.MAGENTA);

                    Paragraph tag = new Paragraph(tags[i]);
                        tag
                        .SetWidth(50)
                        .SetFontSize(8)
                        .SetPadding(1)
                        .SetMarginLeft(5)
                        .SetBackgroundColor(new DeviceRgb(137, 207, 240))
                        .SetTextAlignment(TextAlignment.CENTER)
                        .SetFontColor(ColorConstants.WHITE);

                    tagContainer.Add(tag);
                    postTagsContainer.Add(tagContainer);
                    postTagsContainer.SetNextRenderer(new FlexContainerRenderer(tagContainer));
                }

                postTitleContainer.Add(titleParagraph);
                postContentContainer.Add(contentParagraph);

                postContainer.Add(postTitleContainer);
                postContainer.Add(postContentContainer);
                postContainer.Add(postTagsContainer);

                doc.Add(postContainer);


                string text2 = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus magnam dolorum sint in eum alias assumenda ab, " +
                    "voluptatum natus, a, illo neque. Eos praesentium non blanditiis facere. Pariatur laboriosam quia accusamus nobis dolores debitis sit nulla. " +
                    "Culpa alias esse, numquam maiores sequi a! Dolor natus necessitatibus eaque aspernatur provident ducimus quos magnam, quaerat veritatis tempore " +
                    "ad numquam eius laboriosam modi earum autem possimus ipsa voluptatem odit. Minima, deserunt reprehenderit voluptates consequuntur nesciunt dignissimos " +
                    "enim corporis, impedit recusandae ullam eligendi repellat?";


                Paragraph paragraph2 = new Paragraph(text2.ToString());
                paragraph2.SetFontColor(ColorConstants.BLUE);
                doc.Add(paragraph2);

                doc.Close();

            }
            else
            {
                Directory.CreateDirectory($@"{currentDir}\pdfs");

                PdfWriter writer = new PdfWriter(directory.FullName);
                PdfDocument pdfDoc = new PdfDocument(writer);

                Document doc = new Document(pdfDoc);

                Div postContainer = new Div();
                postContainer
                    .SetMaxWidth(200)
                    .SetBackgroundColor(ColorConstants.GRAY);

                Div postTitleContainer = new Div();
                postTitleContainer
                    .SetMargin(10)
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
                    .SetTextRenderingMode((int)FlexWrapPropertyValue.WRAP)
                    .SetPadding(2);

                string postTitleText = "Wonderful days!";
                string postContentText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus magnam dolorum sint in eum alias assumenda ab, " +
                    "voluptatum natus, a, illo neque. Eos praesentium non blanditiis facere. Pariatur laboriosam quia accusamus nobis dolores debitis sit nulla. " +
                    "Culpa alias esse, numquam maiores sequi a! Dolor natus necessitatibus eaque aspernatur provident ducimus quos magnam, quaerat veritatis tempore " +
                    "ad numquam eius laboriosam modi earum autem possimus ipsa voluptatem odit. Minima, deserunt reprehenderit voluptates consequuntur nesciunt dignissimos " +
                    "enim corporis, impedit recusandae ullam eligendi repellat?";
                string[] tags = { "Ljubav", "Radost", "Karijera", "Zadovoljstvo", "Prijatelji", "Porodica" };


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


                iText.Kernel.Geom.Rectangle[] columns =
            {
                new iText.Kernel.Geom.Rectangle(100, 100, 600, 500),
                new iText.Kernel.Geom.Rectangle(100, 0, 200, 500)
            };

                for (int i = 0; i < tags.Length; i++)
                {
                    Div tagContainer = new Div();
                    tagContainer
                        .SetMaxWidth(200)
                        .SetBackgroundColor(ColorConstants.MAGENTA);

                    Paragraph tag = new Paragraph(tags[i]);
                    tag
                    .SetWidth(50)
                    .SetFontSize(8)
                    .SetPadding(1)
                    .SetMarginLeft(5)
                    .SetBackgroundColor(new DeviceRgb(137, 207, 240))
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetFontColor(ColorConstants.WHITE);

                    tagContainer.Add(tag);
                    postTagsContainer.Add(tagContainer);
                    postTagsContainer.SetNextRenderer(new FlexContainerRenderer(tagContainer));
                }

                postTitleContainer.Add(titleParagraph);
                postContentContainer.Add(contentParagraph);

                postContainer.Add(postTitleContainer);
                postContainer.Add(postContentContainer);
                postContainer.Add(postTagsContainer);

                doc.Add(postContainer);


                string text2 = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus magnam dolorum sint in eum alias assumenda ab, " +
                    "voluptatum natus, a, illo neque. Eos praesentium non blanditiis facere. Pariatur laboriosam quia accusamus nobis dolores debitis sit nulla. " +
                    "Culpa alias esse, numquam maiores sequi a! Dolor natus necessitatibus eaque aspernatur provident ducimus quos magnam, quaerat veritatis tempore " +
                    "ad numquam eius laboriosam modi earum autem possimus ipsa voluptatem odit. Minima, deserunt reprehenderit voluptates consequuntur nesciunt dignissimos " +
                    "enim corporis, impedit recusandae ullam eligendi repellat?";


                Paragraph paragraph2 = new Paragraph(text2.ToString());
                paragraph2.SetFontColor(ColorConstants.BLUE);
                doc.Add(paragraph2);

                doc.Close();
            }

            

            

        }
    }
}
