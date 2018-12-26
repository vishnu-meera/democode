// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using MediatR;

namespace Core.Commands
{
    public class AddMoveStatus : IRequest<string>
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public string moveStatusItems { get; set; }
        public string moveStatusPercentageObj { get; set; }
    }
}
