﻿using iText.IO.Font.Constants;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Colorspace;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Layout.Renderer;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils;
using Org.BouncyCastle.Asn1.Cms;
using Org.BouncyCastle.Utilities;
using System.Drawing;
using System.IO;
using System.Text;

namespace MentalHealthBlog.API.Services
{
    public class ExportService : IExportService
    {
        public async Task<byte[]> ExportToPDF(List<PostDto> posts)
        {
            PDFGenerators generator = new PDFGenerators();
            byte[] data = await generator.CreatePdfFile(posts);

            return data;

            //Return PDF file

            //Make controller 

            //Call method on frontend
        }
    }
}
