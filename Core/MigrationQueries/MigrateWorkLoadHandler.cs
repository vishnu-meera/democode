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
using System.Collections.Generic;

//
namespace Core.MigrationQueries
{
    public class MigrateWorkLoadHandler : MediatR.IRequestHandler<MigrateWorkLoad, string>
    {
        private readonly IRepository _repository;

        public MigrateWorkLoadHandler(IRepository repository)
        {
            _repository = repository;
        }


        public async Task<string> Handle(MigrateWorkLoad request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAllQithoutPartition<CountryWorkLoad>(nameof(CountryWorkLoad));

            List<List<CountryWorkLoad>> listOfList = items.GroupBy(x => x.PartitionKey)
                                             .Select(group => group.ToList())
                                             .ToList();
            foreach (var enitityList in listOfList)
            {
                var item = await _repository.AddAll<CountryWorkLoad>(enitityList, nameof(CountryWorkLoad));
            }


            return "succeffully migrated the Workload Table";
        }
    }
}
