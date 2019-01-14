// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using MediatR;
using Core.Models;
using System.Collections.Generic;

namespace Core.Queries
{
    public class GetStatus : IRequest<StatusList>
    {
        public string by { get; set; }
    }
}
