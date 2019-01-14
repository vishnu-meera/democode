// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using Core.Sharedkernel;

namespace Core.Entities
{
    public class CountryCapacity : BaseEntity
    {
        public string CommercialUsed_TB { get; set; }
        public string ConsumerUsed_TB { get; set; }
        public string InboundReserved_TB { get; set; }
        public string MaximumUtilization { get; set; }
        public string TimetoLive_Months { get; set; }
        public string TotalCapacityAvailable_TB { get; set; }
        public string TotalDAGs { get; set; }
        public string TotalExpansionDAGs { get; set; }
        public string Utilization { get; set; }
        public string Workload { get; set; }
        public string WorkloadType { get; set; }
    }
}
