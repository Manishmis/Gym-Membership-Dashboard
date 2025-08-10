// Example: Fetch all members
async function fetchMembers() {
  try {
    const response = await fetch('http://localhost:5000/api/members');
    const members = await response.json();
    // Update your UI with the member data
  } catch (error) {
    console.error('Error fetching members:', error);
  }
}

// Example: Add new member
async function addMember(memberData) {
  try {
    const response = await fetch('http://localhost:5000/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    });
    
    if (response.ok) {
      const newMember = await response.json();
      // Handle successful addition
    }
  } catch (error) {
    console.error('Error adding member:', error);
  }
}
