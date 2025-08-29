import responses from '../../assets/data/responses.json';
import coverage from '../../assets/data/coverage.json';
import { getUsers } from '../utils/FileUtils';

const processQuery = async (query, context, userId) => {
  if (!query || typeof query !== 'string') {
    console.log(`Invalid query received: ${query}`);
    return { success: false, message: 'Please provide a valid query.' };
  }

  query = query.toLowerCase().trim();
  console.log(`Processing query: "${query}" in context: ${context} for userId: ${userId}`);

  let responseSet;
  switch (context) {
    case 'billQuery':
      responseSet = responses.billQuery;
      break;
    case 'addressUpdate':
      responseSet = responses.addressUpdate;
      break;
    case 'coverageCheck':
      responseSet = responses.coverageCheck;
      break;
    default:
      console.log(`Invalid context: ${context}`);
      return { success: false, message: 'Invalid query context.' };
  }

  for (const response of responseSet) {
    const regex = new RegExp(response.pattern, 'i');
    if (regex.test(query)) {
      let message = response.response;
      console.log(`Matched pattern: ${response.pattern} for intent: ${response.intent}`);

      if (context === 'billQuery' && response.intent === 'bill_details') {
        const users = await getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) {
          console.log(`User not found for userId: ${userId}`);
          return { success: false, message: 'User not found.' };
        }
        const billItems = user.bill.items
          .map(item => `${item.label}: $${item.amount.toFixed(2)}`)
          .join(', ');
        message = message.replace('BILL_DETAILS', billItems);
      } else if (context === 'billQuery' && response.intent === 'double_charge') {
        message = message.replace('TICKET_ID', `T${Math.floor(Math.random() * 10000)}`);
      } else if (context === 'addressUpdate') {
        const newAddress = query.match(/to\s+(.+)/i)?.[1] || 'new address';
        message = message.replace('NEW_ADDRESS', newAddress);
      } else if (context === 'coverageCheck') {
        const zipMatch = query.match(/\d{5}/) || query.match(/zip\s*(\d{5})/i);
        const zip = zipMatch ? zipMatch[0] || zipMatch[1] : null;
        const coverageData = zip ? coverage.find(c => c.zip === zip) : null;
        message = message.replace(
          'COVERAGE_DETAILS',
          coverageData ? coverageData.availability : 'No coverage data available'
        ).replace('ZIP_CODE', zip || 'provided address');
      }

      console.log(`Returning response: ${message}`);
      return { success: true, message };
    }
  }

  console.log(`No matching pattern found for query: "${query}"`);
  return { success: false, message: 'Sorry, I didn’t understand your query. Please try rephrasing.' };
};

export default processQuery;