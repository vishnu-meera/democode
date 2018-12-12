// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
//using Core.Exceptions;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Queries;
using Core.Exceptions;
using System.Collections.Generic;

namespace Core.QueryHandler
{
    public class GetAllWorkLoadsHandler : MediatR.IRequestHandler<GeAlltWorkLoads, CountryWorkLoadListModel>
    {
        private readonly IRepository _repository;

        public GetAllWorkLoadsHandler(IRepository repository)
        {
            _repository = repository;
        }
        public async Task<CountryWorkLoadListModel> Handle(GeAlltWorkLoads request, CancellationToken cancellationToken)
        {

            var items = await _repository.GetAll<CountryWorkLoad>(nameof(CountryWorkLoad), request.partionKey);

            if (items == null)
            {
                throw new NotFoundException(nameof(Country), request.partionKey);
            }

            if (items.Count() == 0)
            {
                throw new NotFoundException(nameof(Country), request.partionKey);
            }

            return new CountryWorkLoadListModel
            {
                countryWorkLoads = items.Select(item => new CountryWorkLoadModel
                {
                    Key = item.PartitionKey,
                    WorkLoadName = item.RowKey,
                    WorkLoadStatus = item.WorkLoadStatus,
                    DataCenterId = item.DataCenterId,
                    DataCenterName = item.DataCenterName,
                    Phases = item.Phases
                }).ToList()
            };
        }
    }
}
