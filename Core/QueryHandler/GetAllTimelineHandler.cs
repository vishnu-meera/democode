
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
    public class GetAllTimelineHandler : MediatR.IRequestHandler<GetAllTImeline, TimelineList>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public GetAllTimelineHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<TimelineList> Handle(GetAllTImeline request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<Country>(nameof(Country), CountryPartionKey);
            int count = 0;
            var timelinelist = new List<Timeline>();

            foreach (var item in items)
            {
                if (item.Status == "InProgress")
                {
                    var dcItems = await _repository.GetAll<CountryDataCenters>(nameof(CountryDataCenters), item.RowKey);
                    if (dcItems.Count() > 0)
                    {
                        timelinelist.Add(new Timeline
                        {
                            CountryName = item.RowKey,
                            TimelineObject = dcItems.Select(c => c.TImeLine).FirstOrDefault()
                        });
                        count++;
                    }

                }
                
            }

            return new TimelineList
            {
                Count = count,
                TimelineListObject = timelinelist
            };
        }
    }
}
