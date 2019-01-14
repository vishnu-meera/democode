// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using MediatR;

namespace Core.Commands
{
    public class AddRoadMap:IRequest<string>
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public string CountryName { get; set; }
        public string Status { get; set; }
        public string RoadMapObject { get; set; }
    }
}
