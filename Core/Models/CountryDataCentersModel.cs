// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

namespace Core.Models
{
    public class CountryDataCentersModel
    {
        public string PartionKey { get; set; }
        public string RowKey { get; set; }
        public string DataCenterName { get; set; }
        public string DataCenterStatus { get; set; }
        public string TimeLine { get; set; }
        public string WorkLoads { get; set; }
    }
}
