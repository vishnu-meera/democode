// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using MediatR;
using Core.Models;

namespace Core.Queries
{
    public class GetMoveStatus : IRequest<DataCenterMoveStatusModel>
    {
        public string Country { get; set; }
    }
}
