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
    public class AddWorkLoadHandler : IRequestHandler<AddWorkLoad, string>
    {
        private readonly IRepository _repository;

        public AddWorkLoadHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> Handle(AddWorkLoad request, CancellationToken cancellationToken)
        {
            var entity = new CountryWorkLoad
            {
                PartitionKey = request.Key,
                RowKey = request.WorkLoadName,
                WorkLoadStatus = request.WorkLoadStatus,
                DataCenterId = request.DataCenterId,
                DataCenterName = request.DataCenterName,
                Phases = request.Phases
            };

            var item = await _repository.Add<CountryWorkLoad>(entity, nameof(CountryWorkLoad));

            return item;
        }
    }
}
