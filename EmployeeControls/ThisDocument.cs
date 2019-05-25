using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Xml.Linq;
using Microsoft.Office.Tools.Word;
using Microsoft.VisualStudio.Tools.Applications.Runtime;
using Office = Microsoft.Office.Core;
using Word = Microsoft.Office.Interop.Word;

namespace EmployeeControls
{
    public partial class ThisDocument
    {
        [CachedAttribute()]
        public string employeeXMLPartID = string.Empty;
        private Office.CustomXMLPart employeeXMLPart;
        private const string prefix = "xmlns:ns='http://schemas.microsoft.com/vsto/samples'";

        private string GetXmlFromResource()
        {
            System.Reflection.Assembly asm =
                System.Reflection.Assembly.GetExecutingAssembly();
            System.IO.Stream stream1 = asm.GetManifestResourceStream(
                "EmployeeControls.employees.xml");

            using (System.IO.StreamReader resourceReader =
                    new System.IO.StreamReader(stream1))
            {
                if (resourceReader != null)
                {
                    return resourceReader.ReadToEnd();
                }
            }

            return null;
        }

        private void AddCustomXmlPart(string xmlData)
        {
            if (xmlData != null)
            {
                employeeXMLPart = this.CustomXMLParts.SelectByID(employeeXMLPartID);
                if (employeeXMLPart == null)
                {
                    employeeXMLPart = this.CustomXMLParts.Add(xmlData);
                    employeeXMLPart.NamespaceManager.AddNamespace("ns",
                        @"http://schemas.microsoft.com/vsto/samples");
                    employeeXMLPartID = employeeXMLPart.Id;
                }
            }
        }

        private void BindControlsToCustomXmlPart()
        {
            string xPathName = "ns:employees/ns:employee/ns:name";
            this.plainTextContentControl1.XMLMapping.SetMapping(xPathName,
                prefix, employeeXMLPart);

            string xPathDate = "ns:employees/ns:employee/ns:hireDate";
            this.datePickerContentControl1.DateDisplayFormat = "MMMM d, yyyy";
            this.datePickerContentControl1.XMLMapping.SetMapping(xPathDate,
                prefix, employeeXMLPart);

            string xPathTitle = "ns:employees/ns:employee/ns:title";
            this.dropDownListContentControl1.XMLMapping.SetMapping(xPathTitle,
                prefix, employeeXMLPart);
        }

        private void ThisDocument_Startup(object sender, System.EventArgs e)
        {
            string xmlData = GetXmlFromResource();

            if (xmlData != null)
            {
                AddCustomXmlPart(xmlData);
                BindControlsToCustomXmlPart();
            }
        }

        private void ThisDocument_Shutdown(object sender, System.EventArgs e)
        {
        }

        #region VSTO Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InternalStartup()
        {
            this.Startup += new System.EventHandler(ThisDocument_Startup);
            this.Shutdown += new System.EventHandler(ThisDocument_Shutdown);
        }

        #endregion
    }
}
