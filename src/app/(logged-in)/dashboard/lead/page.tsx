import { getLeads } from "./actions/get-leads"

const LeadPage = async() =>{
    const leads = await getLeads()

return( <div className="flex-1 space-y-6">
    
        <div>
          <h1>Leads</h1>
          <p>Gerencie suas campanhas automatizadas</p>
        </div>
        {leads?.map(l => (<div key={l.id}>{l.name} {l.phone}</div>))}
        
        </div>
        )
}


export default LeadPage