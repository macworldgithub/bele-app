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

  // Load user data if userId is provided
  let user = null;
  if (userId) {
    const users = await getUsers();
    user = users.find(u => u.id === userId);
    if (!user) {
      console.log(`User not found for userId: ${userId}`);
      return { success: false, message: 'User not found.' };
    }
  }

  // Default values for placeholders
  const currentDate = new Date();
  const formatDate = (date) => date.toISOString().split('T')[0];
  const defaultBillDate = formatDate(new Date(currentDate.setDate(currentDate.getDate() - 15)));
  const defaultPaymentDate = formatDate(new Date(currentDate.setDate(currentDate.getDate() - 5)));
  const defaultDueDate = formatDate(new Date(currentDate.setDate(currentDate.getDate() + 15)));
  const defaultBillCycleEnd = formatDate(new Date(currentDate.setDate(currentDate.getDate() + 30)));
  const defaultEmail = user?.email || 'your-email@example.com';
  const defaultPaymentAmount = user?.bill?.items?.reduce((acc, item) => acc + item.amount, 0)?.toFixed(2) || '50.00';
  const defaultExpansionDate = formatDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)));

  for (const response of responseSet) {
    const regex = new RegExp(response.pattern, 'i');
    if (regex.test(query)) {
      let message = response.response;
      console.log(`Matched pattern: ${response.pattern} for intent: ${response.intent}`);

      // Generate a ticket ID for responses that need it
      const ticketId = `T${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      if (context === 'billQuery') {
        if (response.intent === 'bill_details') {
          if (!user) {
            console.log(`User not found for userId: ${userId}`);
            return { success: false, message: 'User not found.' };
          }
          const billItems = user.bill.items
            .map(item => `${item.label}: $${item.amount.toFixed(2)}`)
            .join(', ');
          message = message.replace('BILL_DETAILS', billItems);
        } else if (response.intent === 'double_charge') {
          message = message.replace('TICKET_ID', ticketId);
        } else if (response.intent === 'late_fee') {
          message = message.replace('BILL_DATE', user?.bill?.date || defaultBillDate);
        } else if (response.intent === 'payment_status') {
          message = message
            .replace('PAYMENT_AMOUNT', defaultPaymentAmount)
            .replace('PAYMENT_DATE', user?.bill?.paymentDate || defaultPaymentDate)
            .replace('EMAIL', defaultEmail);
        } else if (response.intent === 'billing_cycle') {
          message = message
            .replace('BILL_CYCLE_END', user?.bill?.cycleEnd || defaultBillCycleEnd)
            .replace('DUE_DATE', user?.bill?.dueDate || defaultDueDate);
        }
      } else if (context === 'addressUpdate') {
        const newAddress = query.match(/to\s+(.+)/i)?.[1] || 'new address';
        message = message.replace('NEW_ADDRESS', newAddress);
      } else if (context === 'coverageCheck') {
        // Match 4 or 5 digit postcodes or partial address like "Castle Hill"
        const zipMatch = query.match(/\d{4,5}/) || query.match(/zip\s*(\d{4,5})/i);
        let zip = zipMatch ? zipMatch[0] || zipMatch[1] : null;
        let displayZip = zip;
        
        // Map "Castle Hill" or variations to zip "2145"
        if (!zip && query.includes('castle hill')) {
          zip = '2145';
        }

        const coverageData = zip ? coverage.find(c => c.zip === zip) : null;
        // Use displayAddress if available, otherwise fall back to input or zip
        displayZip = coverageData?.displayAddress || zip || query;
        message = message.replace(
          'COVERAGE_DETAILS',
          coverageData ? coverageData.availability : 'No coverage data available'
        ).replace('ZIP_CODE', displayZip);
        
        if (response.intent === 'coverage_issue') {
          message = message.replace('TICKET_ID', ticketId);
        } else if (response.intent === 'network_type') {
          const networkTypes = coverageData?.networkTypes?.join(', ') || '4G, 5G';
          const maxSpeed = coverageData?.maxSpeed || '100 Mbps';
          message = message.replace('NETWORK_TYPES', networkTypes).replace('MAX_SPEED', maxSpeed);
        } else if (response.intent === 'expansion_plans') {
          message = message.replace('EXPANSION_DATE', coverageData?.expansionDate || defaultExpansionDate);
        }
      }

      console.log(`Returning response: ${message}`);
      return { success: true, message };
    }
  }

  console.log(`No matching pattern found for query: "${query}"`);
  return { success: false, message: 'Sorry, I didn’t understand your query. Please try rephrasing.' };
};

export default processQuery;