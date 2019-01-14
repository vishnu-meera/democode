// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using Core.Sharedkernel;
namespace Core.Entities
{
    public class DataCenterMoveStatus:BaseEntity
    {
        public string moveStatusPercentageObj { get; set; }
        public string moveStatusItems { get; set; }
    }
}
