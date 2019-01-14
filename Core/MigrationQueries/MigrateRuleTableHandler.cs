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
    public class MigrateRuleTableHandler: MediatR.IRequestHandler<MigrateRuleTable, string>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Rules"; //get it from appsettings

        public MigrateRuleTableHandler(IRepository repository)
        {
            _repository = repository;
        }

 
        public async Task<string> Handle(MigrateRuleTable request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<RuleTable>(nameof(RuleTable), CountryPartionKey);

            var item = await _repository.AddAll<RuleTable>(items, nameof(RuleTable));

            return "succeffully migrated the RuleTable";
        }
    }
}
