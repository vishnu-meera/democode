// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using MediatR;


namespace Core.Commands
{
    public class AddDataCenter: IRequest<string>
    {
        public string PartionKey { get; set; }
        public string RowKey { get; set; }
        public string DataCenterName { get; set; }
        public string DataCenterStatus { get; set; }
        public string TimeLine { get; set; }
        public string WorkLoads { get; set; }
    }
}
