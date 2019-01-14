// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using Core.Sharedkernel;

namespace Core.Entities
{
    public class CountryDataCenters: BaseEntity
    {
        public string DataCenterName { get; set; }
        public string DataCenterStatus { get; set; }
        public string TImeLine { get; set; }
        public string WorkLoads { get; set; }
    }
}
