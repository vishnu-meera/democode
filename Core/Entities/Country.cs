// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using Core.Sharedkernel;

namespace Core.Entities 
{
    public class Country : BaseEntity
    {
        public string Status { get; set; }
        public string GoLocal { get; set; }
        public string Name { get; set; }
        public string AzureStatus { get; set; }
        public string CAPEX { get; set; }
        public string ColoReady { get; set; }
        public string DCVendors { get; set; }
        public string GolocalCountry { get; set; } 
        public string LeaseSigned { get; set; }
        public string TelcoVendor { get; set; }
    }
}
