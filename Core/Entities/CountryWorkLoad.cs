// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using Core.Sharedkernel;

namespace Core.Entities
{
    public class CountryWorkLoad : BaseEntity
    {
        public string WorkLoadStatus { get; set; }
        public string DataCenterId { get; set; }
        public string DataCenterName { get; set; }
        public string Phases { get; set; }
    }
}
