// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using Core.Sharedkernel;

namespace Core.Entities 
{
    public class Country : BaseEntity
    {
        public string Status { get; set; }
        public string DCX_Customers { get; set; }
        public string Name { get; set; }
        public string AzureStatus { get; set; }
        public string CAPEX { get; set; }
        public string GolocalCountry { get; set; } 
        public string GDP { get; set; }
        public string Population { get; set; }
        public string RevenueProjection3Y { get; set; }
        public string RevenueProjection5Y { get; set; }
        public string TAM_Restricted { get; set; }
        public string TAM_UNRestricted { get; set; }
        public string DataCenters { get; set; }
    }
}
