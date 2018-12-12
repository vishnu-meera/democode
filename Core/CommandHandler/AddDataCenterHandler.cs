// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Commands;
using Core.Exceptions;
using MediatR;

namespace Core.CommandHandler
{
    public class AddDataCenterHandler : IRequestHandler<AddDataCenter, string>
    {
        private readonly IRepository _repository;

        public AddDataCenterHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> Handle(AddDataCenter request, CancellationToken cancellationToken)
        {
            var entity = new CountryDataCenters
            {
                PartitionKey = request.PartionKey,
                RowKey = request.RowKey,
                DataCenterName = request.DataCenterName,
                DataCenterStatus = request.DataCenterStatus,
                TImeLine = request.TimeLine,
                WorkLoads = request.WorkLoads
            };

            var item = await _repository.Add<CountryDataCenters>(entity, nameof(CountryDataCenters));

            return item;
        }
    }
}
