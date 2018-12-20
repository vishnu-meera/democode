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

namespace Core.QueryHandler
{
    public class GetRuleTableHandler : MediatR.IRequestHandler<GetRuleTable, RuleTableListModel>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Rules"; //get it from appsettings

        public GetRuleTableHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<RuleTableListModel> Handle(GetRuleTable request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<RuleTable>(nameof(RuleTable), CountryPartionKey);

            if (items == null)
            {
                throw new NotFoundException(nameof(Country), request.id);
            }

            if (items.Count() == 0)
            {
                throw new NotFoundException(nameof(Country), request.id);
            }

            return new RuleTableListModel
            {
                Rules = items.Select(item => new RuleTableModel
                {
                    RuleName = item.RowKey,
                    Impact = item.Impact
                }).ToList()
            };

        }
    }
}
