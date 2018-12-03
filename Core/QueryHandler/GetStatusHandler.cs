
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Queries;
using Core.Exceptions;
using System.Collections.Generic;


namespace Core.QueryHandler
{
    public class GetStatusHandler : MediatR.IRequestHandler<GetStatus, StatusList>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public GetStatusHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<StatusList> Handle(GetStatus request, CancellationToken cancellationToken)
        {
            //sample color cording scheme for country
            //Potential==> number 4
            //Live==> 1
            //Approved==> 3
            //InProgress==2

            var statusList = new StatusList();

            statusList.CountriesStatusList = new Dictionary<string, int>();

            var items = await _repository.GetAll<Country>(nameof(Country), CountryPartionKey);
            foreach (var item in items)
            {
                int status=0;
                switch (item.Status)
                {
                    case "Live":
                        status = 1;
                        break;
                    case "InProgress":
                        status = 2;
                        break;
                    case "Approved":
                        status = 3;
                        break;
                    case "Potential":
                        status = 4;
                        break;
                }
                statusList.CountriesStatusList[item.Name] = status;
            }

            if (items == null)
            {
                throw new NotFoundException(nameof(Country), "Countries Overall Status Check");
            }

            if (items.Count() == 0)
            {
                throw new NotFoundException(nameof(Country), "Countries Overall Status Check");
            }

            return statusList;
        }
    }
}
