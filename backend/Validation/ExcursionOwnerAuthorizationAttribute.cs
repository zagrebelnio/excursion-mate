using Microsoft.AspNetCore.Mvc;

namespace backend.Validation
{
    public class ExcursionOwnerAuthorizationAttribute : TypeFilterAttribute
    {
        public ExcursionOwnerAuthorizationAttribute() : base(typeof(ExcursionOwnerAuthorizationFilter))
        {
            
        }
    }
}
