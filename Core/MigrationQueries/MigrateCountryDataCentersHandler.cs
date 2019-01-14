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

namespace Core.MigrationQueries
{
    public class MigrateCountryDataCentersHandler : MediatR.IRequestHandler<MigrateCountryDataCenters, string>
    {
        private readonly IRepository _repository;

        public MigrateCountryDataCentersHandler(IRepository repository)
        {
            _repository = repository;
        }


        public async Task<string> Handle(MigrateCountryDataCenters request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAllQithoutPartition<CountryDataCenters>(nameof(CountryDataCenters));

            List<List<CountryDataCenters>> listOfList = items.GroupBy(x => x.PartitionKey)
                                             .Select(group => group.ToList())
                                             .ToList();
            foreach(var enitityList in listOfList)
            {
                var item = await _repository.AddAll<CountryDataCenters>(enitityList, nameof(CountryDataCenters));
            }
            

            return "succeffully migrated the Country Table";
        }
    }
}
