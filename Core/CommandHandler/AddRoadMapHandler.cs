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
    public class AddRoadMapHandler : IRequestHandler<AddRoadMap, string>
    {
        private readonly IRepository _repository;

        public AddRoadMapHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> Handle(AddRoadMap request, CancellationToken cancellationToken)
        {
            var entity = new CountryRoadMap
            {
                PartitionKey = request.PartitionKey,
                RowKey = request.RowKey,
                CountryStatus = request.Status,
                RoadMapSummary = request.RoadMapObject
            };

            var item = await _repository.Add<CountryRoadMap>(entity,nameof(CountryRoadMap));

            return item;
        }
    }
}
