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
    public class MigrateRoadMapHandler : MediatR.IRequestHandler<MigrateRoadMap, string>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public MigrateRoadMapHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> Handle(MigrateRoadMap request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<CountryRoadMap>(nameof(CountryRoadMap), CountryPartionKey);

            var item = await _repository.AddAll<CountryRoadMap>(items, nameof(CountryRoadMap));

            return "succeffully migrated the CountryRoadMap Table";
        }
    }

}
