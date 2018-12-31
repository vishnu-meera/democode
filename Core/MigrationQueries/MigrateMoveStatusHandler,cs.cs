// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Queries;
using Core.Exceptions;

namespace Core.MigrationQueries
{
    public class MigrateMoveStatusHandler_cs : MediatR.IRequestHandler<MigrateMoveStatus, string>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public MigrateMoveStatusHandler_cs(IRepository repository)
        {
            _repository = repository;
        }
        public async Task<string> Handle(MigrateMoveStatus request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<DataCenterMoveStatus>(nameof(DataCenterMoveStatus), CountryPartionKey);

            var item = await _repository.AddAll<DataCenterMoveStatus>(items, nameof(DataCenterMoveStatus));

            return "succeffully migrated the DataCenterMoveStatus Table";
        }
    }
}
