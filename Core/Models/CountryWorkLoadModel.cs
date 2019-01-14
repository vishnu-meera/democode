// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

namespace Core.Models
{
    public class CountryWorkLoadModel
    {
        public string Key { get; set; }
        public string WorkLoadName { get; set; }
        public string WorkLoadStatus { get; set; }
        public string DataCenterId { get; set; }
        public string DataCenterName { get; set; }
        public string Phases { get; set; }
    }
}
