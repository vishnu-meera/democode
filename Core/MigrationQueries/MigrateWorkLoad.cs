// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using MediatR;
using Core.Models;

namespace Core.MigrationQueries
{
    public class MigrateWorkLoad : IRequest<string>
    {
        public string Name { get; set; }
    }
}
