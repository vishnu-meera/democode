// Copyright(c) Terawe Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using Core.Sharedkernel;
using System;

namespace Core.Entities
{
    public class Hvacdashboatdtable : BaseEntity
    {
        public string Alert { get; set; }
        public string BatchId { get; set; }
        public double MTemperature { get; set; }
        public double MPressure { get; set; }
        public double ATemperature { get; set; }
        public double AHumidity { get; set; }
        public DateTime TimeCreated { get; set; }
    }
}
