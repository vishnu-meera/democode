// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using Core.Sharedkernel;


namespace Core.Entities
{
    public class CountryRoadMap:BaseEntity
    {
        public string TimeStamp { get; set; }
        public string CountryStatus { get; set; }
        public string RoadMapSummary { get; set; }
    }
}
